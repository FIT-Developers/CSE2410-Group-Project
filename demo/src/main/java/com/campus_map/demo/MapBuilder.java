package com.campus_map.demo;
import java.util.HashMap; 
import com.fasterxml.jackson.databind.*; 
import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import java.util.List; 
import java.util.PriorityQueue;
import com.campus_map.demo.model.*;
import com.campus_map.*;
import java.util.ArrayList; 
import java.nio.file.Path; 

public class MapBuilder {

    //Stores a list of elements found in the JSON file
    static class WayList{

        public List<Element> elements; 

        //Each element (representing an OSM "way") has an ID and a list of nodes that are part of that way
        static class Element{
            //TODO remove ID from this class
            public int id; 
            public String[] nodes; 
        }

    }

    //Edge class for storing the edges once all of the best edges have been found
    class MapEdge implements Comparable<MapEdge>{
        
        public String node1; 
        public String node2; 
        public Coordinate node1Coord; 
        public Coordinate node2Coord; 
        double distance; 

        public MapEdge(String node1, String node2, double distance){
            this.node1 = node1; 
            this.node2 = node2; 
            this.distance = distance; 
            this.node1Coord = NodeReference.getLocation(node1); 
            this.node2Coord = NodeReference.getLocation(node2); 
        }

        //Custom comparator for later insertion into a PQ, possibly other data structures in the future
        public int compareTo(MapEdge otherEdge){
            if (this.distance == otherEdge.distance){
                return 0; 
            }
            else if (this.distance > otherEdge.distance){
                return 1; 
            }
            else {
                return -1; 
            }
        }

    }

    //Simplified haversine formula for distances. Simplified because this is just for comparison
    //and we will never really need to know the actual distance
    double distance(Coordinate x, Coordinate y){

        //Haversine formula (unfortunately) works in Radians...
        double latX = Math.toRadians(x.getLat()); 
        double latY = Math.toRadians(y.getLat()); 
        double lonX = Math.toRadians(x.getLon()); 
        double lonY = Math.toRadians(y.getLon()); 
        
        double chg_lat = latX - latY; 
        double chg_lon = lonX - lonY; 

        //TODO Simplify this comparison - calculating a is heavier than it needs to be
        double a = (Math.sin(chg_lat / 2) * Math.sin(chg_lat / 2))
                     + Math.cos(latX) * Math.cos(latY) *
                      (Math.sin(chg_lon / 2) * Math.sin(chg_lon / 2)); 
        return a; 
    }

    //This constructor probably does too much. It reads in all values from a JSON file, generates
    //edges from those nodes, and selects edges until all nodes in a given way are connected.
    //Repeats this logic until all ways specified in the JSON file have had their Edges generated and stored. 
    public MapBuilder() throws Exception{ 

        //JSON Mapper for creating objects and reading lists from JSON data files extracted from Overpass Turbo
        ObjectMapper mapper = new ObjectMapper(); 
        //Makes it so the mapper won't fail when encountering a value that doesn't have a matching name in 
        //the corresponding class
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false
);

        //A list to store our final "filtered" edges and a list to operate on the "ways" in the JSON file
        List<MapEdge> filteredEdges = new ArrayList<>(); 
        WayList list = mapper.readValue(new File("demo/src/main/resources/data/quad-test-connected-list.json"), WayList.class);

        //Navigate to each node ID & lon/lat combination, create a coordinate for it, and then hash each coordinate to its node ID as a string
        //This actually fills in the NodeReference class, which will be further utilized by other parts of the program
        //to locate a node with a certain ID
        JsonNode root = mapper.readTree(new File("demo/src/main/resources/data/node-locations.json"));
        JsonNode elements = root.get("elements");
        for (JsonNode value : elements){
            Coordinate coord = new Coordinate(Double.parseDouble(value.get("lat").asText()), Double.parseDouble(value.get("lon").asText()));
            NodeReference.addNode(value.get("id").asText(), coord); 
        }

        //For each way in the WayList, iterate through and generate all edges between all nodes. 
        //Add them to a PQ, keyed on their distance. 
        for (WayList.Element curList : list.elements){
        PriorityQueue<MapEdge> pq = new PriorityQueue<>(); 
        for (String s : curList.nodes){
            for(String p : curList.nodes){
                if (s == p){
                    continue;
                }
                MapEdge tempEdge = new MapEdge(s, p, distance(NodeReference.getLocation(s), NodeReference.getLocation(p))); 
                pq.add(tempEdge); 
            }
        }

        //Take the smallest Edge out and add it to the Edge List until all nodes are connected. 
        //TODO This iterates through all edges, it should stop when all nodes are covered but that part is tricky
        HashMap<String, Boolean> nodeChecker = new HashMap<>(); 
        while(pq.size() > 0) {
            MapEdge current = pq.poll(); 
            if (!nodeChecker.containsKey(current.node1) || !nodeChecker.containsKey(current.node2)) {
                filteredEdges.add(current); 
                nodeChecker.put(current.node1, true); 
                nodeChecker.put(current.node2, true); 
            }
        }
    }   
        File outputFile = new File("demo/src/main/resources/data/edge-output.json"); 
        Path outputPath = Path.of("demo/src/main/resources/data/edge-output.json"); 

        mapper.writeValue(outputFile, filteredEdges);
        
        /*for (MapEdge e : filteredEdges){
            Files.writeString(outputPath, e.node1 + "\n", StandardOpenOption.APPEND);
            Coordinate node1Coord = NodeReference.getLocation(e.node1); 
            Files.writeString(outputPath, String.valueOf(node1Coord.getLat()) + " " + String.valueOf(node1Coord.getLon()) + "\n", StandardOpenOption.APPEND); 

            Files.writeString(outputPath, e.node2 + "\n", StandardOpenOption.APPEND);
            Coordinate node2Coord = NodeReference.getLocation(e.node2); 
            Files.writeString(outputPath, String.valueOf(node2Coord.getLat()) + " " + String.valueOf(node2Coord.getLon()) + "\n", StandardOpenOption.APPEND); 


        }*/
        System.out.println("test"); 



        
        
        //Below just generates a list of coordinates and a corresponding Node ID, but I want to insert them into a map anyways
        //NodeList nodeList = mapper.readValue(new File("demo/src/main/resources/data/quad-test-node-list.json"), NodeList.class);
        System.out.println(list.elements.get(0).toString()); 
    }

}
    
