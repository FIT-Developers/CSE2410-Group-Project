package com.campus_map;
import com.campus_map.demo.model.Coordinate;
import java.util.HashMap; 

public class NodeReference {
    public final static HashMap<String, Coordinate> nodeLocationMap = new HashMap<>(); 

    public static void addNode(String id, Coordinate location){
        nodeLocationMap.put(id, location);
    }

    public static Coordinate getLocation(String id){
        return nodeLocationMap.get(id); 
    }
}
