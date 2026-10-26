package com.campus_map.demo.model;
public class Coordinate {

    private double lat; 
    private double lon; 

    public Coordinate(double lat, double lon){
        this.lat = lat;
        this.lon = lon; 
    }

    public double[] getCoordinates(){
        double[] coordArray = new double[2];
        coordArray[0] = lat; 
        coordArray[1] = lon; 
        return coordArray; 
    }

    public void setLat(double newLat){
        lat = newLat; 
    }

    public void setLon(double newLon){
        lon = newLon; 
    }

    public double getLat(){
        return lat; 
    }

    public double getLon(){
        return lon; 
    }

}
