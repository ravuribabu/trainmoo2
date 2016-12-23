package com.rauzr.trainmoo.trainmoo.model;

/**
 * Created by ravuribabu on 12/22/16.
 */

public class Message {

    public String name;
    public String postedAgo;
    public String postedOn;
    public String type;

    public String text;
    public int likes;
    public int replies;

    public Message(String name, String postedAgo, String postedOn, String type, String text, int likes, int replies) {
        this.name = name;
        this.postedAgo = postedAgo;
        this.postedOn = postedOn;
        this.type = type;
        this.text = text;
        this.likes = likes;
        this.replies = replies;
    }
}
