package com.example.serif_mobile

import android.content.ContentResolver
import android.content.Intent
import android.net.Uri
import android.os.Bundle

import io.flutter.app.FlutterActivity
import io.flutter.plugin.common.EventChannel
import io.flutter.plugins.GeneratedPluginRegistrant

const val STREAM_CHANNEL_NAME = "com.coreline.shaerif"

var shareStreamHandler = ShareStreamHandler()

class MainActivity: FlutterActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    GeneratedPluginRegistrant.registerWith(this)

    EventChannel(flutterView, STREAM_CHANNEL_NAME)
        .setStreamHandler(shareStreamHandler)

    shareStreamHandler.pushIntent(intent, this)
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)

    shareStreamHandler.pushIntent(intent, this)
  }
}
