package com.hengheng;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.reactnative.photoview.PhotoViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.cboy.rn.splashscreen.SplashScreen;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "hengheng";
    }
    @Override
        protected void onCreate(Bundle savedInstanceState) {
        new RNDeviceInfo();
            SplashScreen.show(this);  // here
            new PhotoViewPackage();
            super.onCreate(savedInstanceState);
        }
}
