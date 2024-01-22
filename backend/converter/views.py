import requests
import logging 
from datetime import timedelta
from django.shortcuts import render
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Currency, UpdateLog
from .serializers import CurrencySerializer


logger = logging.getLogger(__name__)
EXCHANGE_RATE_API = 'https://v6.exchangerate-api.com/v6/8f766dc547a35852b1d366b4/latest/USD'


# Handles currency conversion
class ConvertCurrency(APIView):
    def get(self, request, from_currency, to_currency, amount):
        #Check and update rates if neeeded, then performs conversion
        try:
            self.refresh_rates()
            return self.perform_conversion(from_currency, to_currency, amount)
        except Exception as e:
            logger.error(str(e)) 
            return Response({'error': 'Unexpected error '}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def refresh_rates(self):
        try:
            last_updated = UpdateLog.objects.latest('updated_at')
        except UpdateLog.DoesNotExist:
            last_updated = None
        # Check if rates need updating based on the last update time
        if not last_updated or last_updated.updated_at < timezone.now() - timedelta(hours=1):
            self.update_rates()
    
    def update_rates(self):
        response = requests.get(EXCHANGE_RATE_API)
        data = response.json()
        
        if 'rates' not in data:
            raise Exception('Error getting rates.')
        
        # Update or create Currency objects with the new rates
        for code, rate in data['rates'].items():
            Currency.objects.update_or_create(code=code, defaults={'rate': rate})

        UpdateLog.objects.update_or_create(id=1 , defaults={'last updated at': timezone.now()})
    
    def perform_conversion(self, from_currency, to_currency, amount):
        try:
            from_rate = Currency.objects.get(code=from_currency.upper()).rate
            to_rate = Currency.objects.get(code=to_currency.upper()).rate
        except Currency.DoesNotExist:
            return Response({'error': 'Invalid Currency'}, status=status.HTTP_400_BAD_REQUEST)
        
        converted_amount = (float(amount) / from_rate) * to_rate
        return Response({'converted_amount': converted_amount})

# Lists all currencies
class CurrencyList(generics.ListAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer