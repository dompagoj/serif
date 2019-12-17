package com.example.serif_mobile

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import androidx.core.content.FileProvider
import io.flutter.plugin.common.EventChannel
import java.io.File
import java.lang.Exception
import java.net.URI

class ShareStreamHandler : EventChannel.StreamHandler {
  private var events: EventChannel.EventSink? = null

  override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
    this.events = events
  }

  override fun onCancel(arguments: Any?) {
    log("End of stream")
    events?.endOfStream()
  }

  fun pushIntent(intent: Intent?, context: Context) {
    if (intent == null) return
    if (intent.action != Intent.ACTION_SEND) return

    events?.success(handleShare(intent, context)) ?: log("Cannot push intent, missing events!")
  }

  private fun handleShare(intent: Intent, context: Context): HashMap<String, String?> {
    val params = HashMap<String, String?>()

    val uri = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
    params["title"] = intent.getStringExtra(Intent.EXTRA_SUBJECT)
    params["path"] = FileDirectory.getAbsolutePath(context, uri)

    return params
  }

  private fun log(data: String?) {
    Log.d("flutter", data ?: "Got null")
  }
}