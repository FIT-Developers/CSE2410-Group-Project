package com.campus_map.demo.model;
public class Coordinate {

    private float lat; 
    private float lon; 

    public Coordinate(float lat, float lon){
        this.lat = lat;
        this.lon = lon; 
    }

    public float[] getCoordinates(){
        float[] coordArray = new float[2];
        coordArray[0] = lon; 
        coordArray[1] = lat; 
        return coordArray; 
    }

    public void setLat(float newLat){
        lat = newLat; 
    }

    public void setLon(float newLon){
        lon = newLon; 
    }

}
