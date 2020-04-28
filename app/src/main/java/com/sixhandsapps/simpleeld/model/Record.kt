package com.sixhandsapps.simpleeld.model

import android.os.Parcel
import android.os.Parcelable

class Record(
    val id: Int,
    val type: Int,
    val location: String,
    val remark: String?,
    val startTime: Long,
    val endTime: Long
) : Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readInt(),
        parcel.readString()!!,
        parcel.readString(),
        parcel.readLong(),
        parcel.readLong()
    ) {
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeInt(id)
        parcel.writeInt(type)
        parcel.writeString(location)
        parcel.writeString(remark)
        parcel.writeLong(startTime)
        parcel.writeLong(endTime)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<Record> {
        override fun createFromParcel(parcel: Parcel): Record {
            return Record(parcel)
        }

        override fun newArray(size: Int): Array<Record?> {
            return arrayOfNulls(size)
        }
    }
}