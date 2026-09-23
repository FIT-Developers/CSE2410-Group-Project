package com.campus_map.demo.model;
import java.util.ArrayList;
public class Node {
    private Coordinate coords; 
    private ArrayList<Edge> neighbors; 

    public Node(Coordinate coords){
        this.coords = coords; 
        this.neighbors = new ArrayList<>();
    }

    public Coordinate getCoordinates(){
        return coords;
    }

    public void addNeighbor(Edge newEdge){
        neighbors.add(newEdge); 
    }

    public ArrayList<Edge> getNeighbors(){
        return neighbors;
    }

}
