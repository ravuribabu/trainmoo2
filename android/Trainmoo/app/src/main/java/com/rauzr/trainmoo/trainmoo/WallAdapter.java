package com.rauzr.trainmoo.trainmoo;

import android.content.Context;
import android.databinding.DataBindingUtil;
import android.support.v7.widget.RecyclerView;
import android.text.Html;
import android.text.Layout;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.rauzr.trainmoo.trainmoo.databinding.MessageBinding;
import com.rauzr.trainmoo.trainmoo.fonts.RobotoTextView;
import com.rauzr.trainmoo.trainmoo.model.Message;

import java.util.ArrayList;

/**
 * Created by ravuribabu on 12/21/16.
 */

public class WallAdapter extends RecyclerView.Adapter<WallAdapter.MessageHolder> {

    private static int VIEW_HOLDER_COUNT;

    private ArrayList<Message> messages;

    public WallAdapter(ArrayList<Message> messages) {
        this.messages = messages;
    }

    @Override
    public MessageHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        Context context = parent.getContext();
        LayoutInflater inflater = LayoutInflater.from(context);

        View view = inflater.inflate(R.layout.message, parent, false);
        MessageHolder messageHolder = new MessageHolder(view);


        return messageHolder;
    }

    @Override
    public void onBindViewHolder(MessageHolder holder, int position) {
        holder.bind(position);
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    class MessageHolder extends RecyclerView.ViewHolder implements View.OnClickListener {

        MessageBinding binding;

        public MessageHolder(View itemView) {
            super(itemView);
            binding = DataBindingUtil.bind(itemView);
            RobotoTextView textView = (RobotoTextView) itemView.findViewById(R.id.textViewMessageText);
            textView.setText(Html.fromHtml("<b>Ram</b><h1>babu</h1>"));
            //cache view
        }

        void bind(int listIndex){
            Message message = messages.get(listIndex);
            binding.setMessage(message);
            if (message.type.equalsIgnoreCase("notification") || message.type.equalsIgnoreCase("assignment")) {
                RobotoTextView robotoTextView = (RobotoTextView) itemView.findViewById(R.id.message_type);
                robotoTextView.setTextColor(itemView.getResources().getColor(R.color.cpb_red));
            }
        }
        @Override
        public void onClick(View view) {

        }
    }
}


