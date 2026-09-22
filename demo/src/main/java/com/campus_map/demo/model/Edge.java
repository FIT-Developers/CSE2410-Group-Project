package com.campus_map.demo.model;

public class Edge {
    private Node host;
    private Node destination; 
    private float weight; 

    public Edge(Node host, Node destination, float weight){
        this.host = host;
        this.destination = destination; 
        this.weight = weight; 
    }

    public Node getHost(){
        return host; 
    }
    
    public Node getDestination(){
        return destination; 
    }

    public float getWeight(){
        return weight; 
    }
}
