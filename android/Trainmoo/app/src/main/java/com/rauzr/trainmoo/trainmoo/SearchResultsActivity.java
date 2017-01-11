package com.rauzr.trainmoo.trainmoo;

import android.app.Activity;
import android.app.SearchManager;
import android.content.Intent;
import android.databinding.tool.util.L;
import android.os.Bundle;
import android.util.Log;

/**
 * Created by ravuribabu on 12/23/16.
 */

public class SearchResultsActivity extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {

        if (Intent.ACTION_SEARCH.equals(intent.getAction())) {
            String query = intent.getStringExtra(SearchManager.QUERY);

            Log.e("SearchResultsActivity", "Query: " + query);
        }
    }
}
