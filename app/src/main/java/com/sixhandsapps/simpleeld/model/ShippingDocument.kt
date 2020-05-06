package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

class ShippingDocument(
    @SerializedName("session_shipping_document_id") val sessionDocId: Int,
    @SerializedName("session_id") val sessionId: Int,
    val id: Int,
    @SerializedName("shipping_document_external_id") val shippingDocumentExternalId: String,
    @SerializedName("session_shipping_document_status") val sessionShippingDocumentStatus: String
)