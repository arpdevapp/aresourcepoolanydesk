package com.aresourcepool.aresourcepoolanydesk.utils

enum class DataModelType{
    SignIn, StartStreaming,EndCall, Offer, Answer, IceCandidates, TouchEvent, KeyEvent, MouseEvent
}


data class DataModel(
    val type:DataModelType?=null,
    val username:String,
    val target:String?=null,
    val data:Any?=null
)
