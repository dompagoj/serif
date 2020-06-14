package com.shareif;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Arrays;

public class UrlsProvider {
  private String[] urls;
  private ReactContext reactContext;

  public void setReactContext(ReactContext reactContext) {
    this.reactContext = reactContext;
    reactContext.addLifecycleEventListener(new LifecycleEventListener() {
      @Override
      public void onHostResume() {
        if (UrlsProvider.this.urls == null) {
          return;
        }
        UrlsProvider.this.registerUrls(UrlsProvider.this.urls);
      }

      @Override
      public void onHostPause() { }

      @Override
      public void onHostDestroy() { }
    });
  }

  public void registerUrls(String[] urls) {
    Log.d("shareif-dbg", "registering urls " + Arrays.toString(urls));
    if (reactContext == null) {
      this.urls = urls;
      return;
    }
    this.urls = null;

    WritableMap params = Arguments.createMap();
    WritableArray array = new WritableNativeArray();
    for (String url : urls) {
      array.pushString(url);
    }
    params.putArray("uris", array);

    Log.d("shareif-dbg", "emitting ShareFileIntent");
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit("ShareFileIntent", params);
  }
}
