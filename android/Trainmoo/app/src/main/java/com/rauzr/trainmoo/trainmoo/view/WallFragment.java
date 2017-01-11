package com.rauzr.trainmoo.trainmoo.view;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.LoaderManager;
import android.support.v4.content.AsyncTaskLoader;
import android.support.v4.content.Loader;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.rauzr.trainmoo.trainmoo.R;
import com.rauzr.trainmoo.trainmoo.WallAdapter;
import com.rauzr.trainmoo.trainmoo.model.Message;
import com.rauzr.trainmoo.trainmoo.utils.NetworkUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

/**
 * Created by ravuribabu on 12/23/16.
 */

public class WallFragment extends Fragment implements   LoaderManager.LoaderCallbacks<ArrayList<Message>> {

    private static final int WALL_LOADER = 786;

    private RecyclerView mMessages;
    private WallAdapter wallAdapter;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.wall, container, false);
    }


    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        getActivity().setTitle("Rauzr Wall");

        mMessages = (RecyclerView) view.findViewById(R.id.messages);
        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity());
        mMessages.setLayoutManager(layoutManager);
        mMessages.setHasFixedSize(true);
        wallAdapter = new WallAdapter(getFakeMessages());
        mMessages.setAdapter(wallAdapter);

        getActivity().getSupportLoaderManager().initLoader(WALL_LOADER, null, this);

        Bundle queryBundle = new Bundle();
        queryBundle.putString("QUERY", "https://localhost:8080/");

        LoaderManager loaderManager = getActivity().getSupportLoaderManager();
        Loader<ArrayList<Message>> wallLoader = loaderManager.getLoader(WALL_LOADER);
        if (wallLoader == null) {
            loaderManager.initLoader(WALL_LOADER, queryBundle, this);
        } else {
            loaderManager.restartLoader(WALL_LOADER, queryBundle, this);
        }
    }


    private ArrayList<Message> getFakeMessages(){

        ArrayList<Message> messages = new ArrayList<>();

        messages.add(new Message("Rohan Ravuri", "2 days ago", "Code School 1", "Discussion", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500", 10, 2));

        return messages;

    }

    private ArrayList<Message> getFakeMessages2(){

        ArrayList<Message> messages = new ArrayList<>();

        String response = null;
        try {
            response = NetworkUtils.getResponseFromHttpUrl();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (response != null)
            Log.i("RESPONSE: ", response);
        try {
            if (response != null) {
                JSONArray posts = new JSONArray(response);

                for (int i = 0; (i < posts.length()); i++) {
                    JSONObject jsonObject = posts.getJSONObject(i);
                    String type = jsonObject.getString("type").toString();
                    String text = jsonObject.getString("text").toString();

                    messages.add(new Message("Rambabu Ravuri", "2 days ago", "Code School 1", type, text, 10, 2));
                }
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }

//        messages.add(new Message("Rambabu Ravuri", "2 days ago", "Code School 1", "Discussion", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500", 10, 2));
//        messages.add(new Message("Santhi Ravuri", "2 days ago", "Code School 1", "Notification",
//                "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters", 10, 2));
//        messages.add(new Message("Rohan Ravuri", "2 days ago",
//                "Code School 1", "Discussion", "as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and", 10, 2));
//        messages.add(new Message("Rambabu Ravuri", "2 days ago", "Code School 1", "Assignment",
//                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500", 10, 2));
//        messages.add(new Message("Kushi Ravuri", "2 days ago", "Code School 1", "Task",
//                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour", 10, 2));
//        messages.add(new Message("Rambabu Ravuri", "2 days ago", "Code School 1", "Discussion",
//                "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections", 10, 2));

        return messages;

    }

    @Override
    public Loader<ArrayList<Message>> onCreateLoader(int id, final Bundle args) {
        return new AsyncTaskLoader<ArrayList<Message>>(getActivity()) {
            @Override
            protected void onStartLoading() {
                if (args == null) {
                    return;
                }
                forceLoad();
            }

            @Override
            public ArrayList<Message> loadInBackground() {
                return getFakeMessages2();
            }
        };
    }

    @Override
    public void onLoadFinished(Loader<ArrayList<Message>> loader, ArrayList<Message> data) {
        if (null == data) {
            Log.e("LOADER", "LOADER: Failed to load data");
        } else {
            mMessages.setAdapter(new WallAdapter(data));
        }
    }

    @Override
    public void onLoaderReset(Loader<ArrayList<Message>> loader) {

    }

}
