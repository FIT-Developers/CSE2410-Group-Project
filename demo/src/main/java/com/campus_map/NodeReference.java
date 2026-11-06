package com.campus_map;
import com.campus_map.demo.model.*; 
import java.util.HashMap; 
import java.util.ArrayList; 

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



    

    
    }

