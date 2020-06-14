package com.shareif;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.ReactActivity;

import java.util.ArrayList;

public class MainActivity extends ReactActivity {
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "shareif";
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    Log.d("shareif-dbg", "onNewIntent");
    this.handleIntent(intent);
  }

  @Override
  protected void onResume() {
    super.onResume();
    Log.d("shareif-dbg", "onResume");
    this.handleIntent(getIntent());
  }

  private void handleIntent(Intent intent) {
    String action = intent.getAction();
    String type = intent.getType();

    if (!Intent.ACTION_SEND.equals(action) && !Intent.ACTION_SEND_MULTIPLE.equals(action)) {
      return;
    }

    if (!intent.hasExtra(Intent.EXTRA_STREAM)) {
      return;
    }

    ArrayList<Uri> filesUris = new ArrayList<>();
    if (Intent.ACTION_SEND.equals(action)) {
      filesUris.add(intent.getParcelableExtra(Intent.EXTRA_STREAM));
    }

    if (Intent.ACTION_SEND_MULTIPLE.equals(action)) {
      filesUris = new ArrayList<>(intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM));
    }

    intent.removeExtra(Intent.EXTRA_STREAM);
    Log.d("shareif-dbg", filesUris.toString());
    if (filesUris.size() == 0) {
      return;
    }
    RNHandleShareFileIntentModule.urlsProvider.registerUrls(Utils.urisToStrings(filesUris));
  }
}
