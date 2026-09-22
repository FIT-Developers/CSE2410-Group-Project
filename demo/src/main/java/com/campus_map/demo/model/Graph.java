package com.campus_map.demo.model;
import java.util.HashMap;
import java.util.ArrayList; 
public class Graph {
    private HashMap<Node, ArrayList<Edge>> nodeMap; 
    private int size; 

    public Graph(){
        nodeMap = new HashMap<>(); 
        size = 0; 
    }

    public void addNodeOnly(Node newNode){
        ArrayList<Edge> emptyList = new ArrayList<>(); 
        nodeMap.put(newNode, emptyList); 
    }

    public void addNodeWithEdge(Node newNode, Edge newEdge){
        ArrayList<Edge> newList = new ArrayList<>(); 
        newList.add(newEdge); 
        nodeMap.put(newNode, newList); 
    }
}
