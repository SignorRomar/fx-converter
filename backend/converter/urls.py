from .views import CurrencyList, ConvertCurrency
from django.urls import path, include

urlpatterns = [
    path('currencies/', CurrencyList.as_view(), name='currency'),
    path('convert/<str:from_currency>/<str:to_currency>/<str:amount>/', ConvertCurrency.as_view(), name='convert_currency   ' )
]
