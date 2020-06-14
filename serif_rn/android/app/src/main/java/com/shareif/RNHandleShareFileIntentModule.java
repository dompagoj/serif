package com.shareif;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class RNHandleShareFileIntentModule extends ReactContextBaseJavaModule {
  public final static UrlsProvider urlsProvider = new UrlsProvider();

  RNHandleShareFileIntentModule(ReactApplicationContext context) {
    super(context);
    urlsProvider.setReactContext(context);
  }

  @NonNull
  @Override
  public String getName() {
    return "RNHandleShareFileIntentModule";
  }
}
