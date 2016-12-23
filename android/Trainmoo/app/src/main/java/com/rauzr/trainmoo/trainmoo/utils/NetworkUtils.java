package com.rauzr.trainmoo.trainmoo.utils;

import android.net.Uri;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Scanner;

/**
 * Created by ravuribabu on 12/22/16.
 */

public class NetworkUtils {

    final static String WALL_URL =
            "http://192.168.1.34:8080/api/posts?classids=582a85f6ebcc9c8939463ffc,582a8601ebcc9c8939463ffd,5829ffc6ebcc9c8939463ff6,5829ffd0ebcc9c8939463ff7,582a8eacc3decb8fc5eb0d86,582a8eb5c3decb8fc5eb0d87&postType=";


    public static String getResponseFromHttpUrl() throws IOException {

        Uri builtUri = Uri.parse(WALL_URL);

        URL url = null;
        try {
            url = new URL(builtUri.toString());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
        try {
            InputStream in = urlConnection.getInputStream();

            Scanner scanner = new Scanner(in);
            scanner.useDelimiter("\\A");

            boolean hasInput = scanner.hasNext();
            if (hasInput) {
                return scanner.next();
            } else {
                return null;
            }
        } finally {
            urlConnection.disconnect();
        }
    }
}
