package com.campusmap.routing.model;
import java.util.ArrayList;
public class Node {
    private String id; 
    private Coordinate coords; 
    private ArrayList<Edge> neighbors; 

    public Node(String id, Coordinate coords){
        this.id = id; 
        this.coords = coords; 
        this.neighbors = new ArrayList<>();
    }

    public Coordinate getCoordinates(){
        return coords;
    }

    public void addNeighbor(Edge newEdge){
        neighbors.add(newEdge); 
    }

    public String getId(){
        return id; 
    }

    public ArrayList<Edge> getNeighbors(){
        return neighbors;
    }

}
