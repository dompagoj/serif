package com.shareif;

import android.net.Uri;

import java.util.ArrayList;
import java.util.List;

public class Utils {
  public static String[] urisToStrings(List<Uri> uris) {
    ArrayList<String> strings = new ArrayList<>();
    for (Uri uri : uris) {
      strings.add(uri.toString());
    }

    return strings.toArray(new String[]{});
  }
}
