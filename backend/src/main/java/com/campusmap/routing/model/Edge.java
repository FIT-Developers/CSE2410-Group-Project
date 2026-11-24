package com.campusmap.routing.model;

public class Edge {
    private Node destination; 
    private double weight; 

    public Edge(Node destination, double weight){
        this.destination = destination; 
        this.weight = weight; 
    }

    public Node getDestination(){
        return destination; 
    }

    public double getWeight(){
        return weight; 
    }
}
