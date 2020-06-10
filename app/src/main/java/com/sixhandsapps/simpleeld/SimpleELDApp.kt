package com.sixhandsapps.simpleeld

import android.app.Application
import com.sixhandsapps.simpleeld.di.AppComponent
import com.sixhandsapps.simpleeld.di.AppModule
import com.sixhandsapps.simpleeld.di.DaggerAppComponent

class SimpleELDApp: Application() {
    companion object {
        lateinit var appComponent: AppComponent
    }

    init {
        appComponent = DaggerAppComponent.builder().appModule(AppModule(this)).build()
    }
}