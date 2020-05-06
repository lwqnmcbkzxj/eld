package com.sixhandsapps.simpleeld.model

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.SerializedName

class Record(
    @SerializedName("record_id") val id: Int,
    @SerializedName("record_type") var type: String?,
    @SerializedName("sub_type") val subType: Int,
    @SerializedName("record_location") var location: String?,
    @SerializedName("record_remark") var remark: String?,
    @SerializedName("record_start_dt") var startTime: String,
    @SerializedName("record_end_dt") var endTime: String
) : Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readString(),
        parcel.readInt(),
        parcel.readString(),
        parcel.readString(),
        parcel.readString()!!,
        parcel.readString()!!
    ) {
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeInt(id)
        parcel.writeString(type)
        parcel.writeInt(subType)
        parcel.writeString(location)
        parcel.writeString(remark)
        parcel.writeString(startTime)
        parcel.writeString(endTime)
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