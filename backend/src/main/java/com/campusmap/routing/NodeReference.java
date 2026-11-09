package com.campusmap.routing;
import com.campusmap.routing.model.*;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.PriorityQueue;

//This is a class with many static members that I expect to reuse on the backend in multiple scenarios
public class NodeReference {
    public final static HashMap<String, Coordinate> nodeLocationMap = new HashMap<>(); 
    public final static HashMap<String, Node> nodeIdMap = new HashMap<>(); 
    public final static HashMap<String, ArrayList<Node>> spatialHashMap = new HashMap<>(); 
    private static double minLon = -71.186127209009;  
    private static double minLat = 28.0569884;  

    public static void addNodeLocation(String id, Coordinate location){
        nodeLocationMap.put(id, location);  
    }

    private static int[] getSpatialKeyArray(Coordinate coord) {
    double lon = (coord.getLon() - minLon) * (98.0 / 111.0);
    double lat = coord.getLat() - minLat;

    int x = (int)Math.floor(lon / 0.000305);
    int y = (int)Math.floor(lat / 0.000305);
    int[] retVal = new int[2]; 
    retVal[0] = x; 
    retVal[1] = y;
    return retVal; 
}

    private static String getSpatialKey(int x, int y){
        return x + "," + y; 
    }



    public static Coordinate getLocation(String id){
        return nodeLocationMap.get(id); 
    }

    public static void insertSpatial(Node node) {


        int[] targetCell = getSpatialKeyArray(node.getCoordinates()); 
        String key = getSpatialKey(targetCell[0], targetCell[1]); 

        if(spatialHashMap.get(key) == null) {
            ArrayList<Node> newArrayList = new ArrayList<>(); 
            newArrayList.add(node); 
            spatialHashMap.put(key, newArrayList); 
        }
        else {
            spatialHashMap.get(key).add(node); 
        }
    }

    static double distance(Coordinate x, Coordinate y){

        //Haversine formula (unfortunately) works in Radians...
        double latX = Math.toRadians(x.getLat()); 
        double latY = Math.toRadians(y.getLat()); 
        double lonX = Math.toRadians(x.getLon()); 
        double lonY = Math.toRadians(y.getLon()); 
        
        double chg_lat = latX - latY; 
        double chg_lon = lonX - lonY; 

        //TODO Simplify this comparison - calculating a is heavier than it needs to be. This is a second copy of the same method, and I don't even remember how to simplify it. 
        double a = (Math.sin(chg_lat / 2) * Math.sin(chg_lat / 2))
                     + Math.cos(latX) * Math.cos(latY) *
                      (Math.sin(chg_lon / 2) * Math.sin(chg_lon / 2)); 
        return a; 
    }

    public static Node getClosestNode(Coordinate coord) {
    int[] cell = getSpatialKeyArray(coord);

    Node closestNode = null;
    double closestDistance = Double.POSITIVE_INFINITY;

    for (int dx = -1; dx <= 1; dx++) {
        for (int dy = -1; dy <= 1; dy++) {

            String key = getSpatialKey(
                cell[0] + dx,
                cell[1] + dy
            );

            ArrayList<Node> nodes = spatialHashMap.get(key);

            if (nodes == null) {
                continue;
            }

            for (Node node : nodes) {
                double dist = distance(node.getCoordinates(), coord);

                if (dist < closestDistance) {
                    closestDistance = dist;
                    closestNode = node;
                }
            }
        }
    }

    return closestNode;
}

    public static ArrayList<Node> getRoute(Node a, Node b){
        //This is a java record which is cool and I know very little about
        record QueueItem(Node node, double distance){}

        //Keeps track of current distances - so the queue doesn't have to be searched to find a node
        //and update it's distance
        HashMap<Node, Double> distances = new HashMap<>(); 

        //This keeps a reference of the node that was previously traversed to arrive at the second node
        //in the format <Desination, Previous>, so that a route can be reconstructed all the way back to our start node
        HashMap<Node, Node> predecessors = new HashMap<>();

        //Keeps track of the next node to be used, uses a QueueItem to store distance since the Nodes don't 
        //actually store distance by default. The lambda expression is a comparator, which is long and clanky
        //since comparitors must return an int and not the double specified by e1.distance()
        PriorityQueue<QueueItem> queue = new PriorityQueue<>((e1, e2) -> {
            if (e1.distance() - e2.distance() < 0) {
                return -1; 
            }
            else if (e1.distance() - e2.distance() > 0) {
                return 1; 
            }
            else {
                return 0;
            }
        }); 

        //Stores the final route from Node a to Node b
        ArrayList<Node> route = new ArrayList<>(); 

        distances.put(a, 0.0); 
        queue.add(new QueueItem(a, 0.0)); 

        while(!queue.isEmpty()) {
            QueueItem curItem = queue.poll(); 
            
            //The node we just polled from the queue is an outdated entry with a higher distance than the current minimum
            //Computing new distances for this Node's neighbors would be a waste, so we skip it
            if (curItem.distance() != distances.get(curItem.node())) {
                continue; 
            }

            //If this is the destination node and it's distance is the minimum, then we are done
            if(curItem.node().getId().equals(b.getId())) {
                break; 
            }

            //For each edge found from the current polled Node, explore the Nodes they lead to
            for (Edge e : curItem.node().getNeighbors()){

                //Calculate the new distance and get the Node that this edge leads to
                double curDistance = curItem.distance() + e.getWeight(); 
                Node curNode = e.getDestination(); 

                //If the node has no associated distance or the new distance is smaller than the current
                // smallest, remap it in distances, predecessors, and requeue it
                if (!distances.containsKey(curNode) || distances.get(curNode) > curDistance) {

                    distances.put(curNode, curDistance); 
                    predecessors.put(curNode, curItem.node()); 
                    queue.add(new QueueItem(curNode, curDistance)); 
                }

            }
        }

        Node curNode = b; 
        while(!curNode.getId().equals(a.getId())) {
            route.addFirst(curNode); 
            curNode = predecessors.get(curNode); 
        }
        route.addFirst(a); 
        return route; 

    }



    

    
    }

