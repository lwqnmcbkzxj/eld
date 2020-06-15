package com.sixhandsapps.simpleeld.di

import android.content.Context
import com.sixhandsapps.simpleeld.di.scopes.AppScope
import com.sixhandsapps.simpleeld.edl.EdlHelper
import dagger.Module
import dagger.Provides

@Module
class AppModule(val appContext: Context) {
    @AppScope
    @Provides
    fun provideAppContext(): Context {
        return appContext
    }

    @AppScope
    @Provides
    fun provideEdlHelper(): EdlHelper {
        return EdlHelper(appContext, "")
    }
}