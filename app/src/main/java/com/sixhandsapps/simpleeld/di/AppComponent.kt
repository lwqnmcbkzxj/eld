package com.sixhandsapps.simpleeld.di

import android.content.Context
import com.sixhandsapps.simpleeld.di.scopes.AppScope
import com.sixhandsapps.simpleeld.edl.EdlHelper
import dagger.Component

@AppScope
@Component(modules = [AppModule::class])
interface AppComponent {
    fun getAppContext(): Context
    fun getEdlHelper(): EdlHelper
}