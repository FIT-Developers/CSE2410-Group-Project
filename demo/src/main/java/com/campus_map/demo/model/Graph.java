package com.campus_map.demo.model;
import java.util.Map;
import java.util.HashMap;

public class Graph {
    
    private Map<String, Node> nodeMap;
    private Integer size; 

    public Graph(){
        nodeMap = new HashMap<String, Node>(); 
        size = 0; 
    }

    public void addNode(String nodeName, float lonCoord, float latCoord){
        Coordinate coords = new Coordinate(lonCoord, latCoord);
        Node newNode = new Node(coords); 
        nodeMap.put(nodeName, newNode); 
        size++;
    }

    public void addEdge(String targetNodeName, Edge newEdge){
        nodeMap.get(targetNodeName).addNeighbor(newEdge);
    }

}
