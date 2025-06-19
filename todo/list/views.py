from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer

def index(request):
    return HttpResponse("Hello, world. You're at the list index!")


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by('-created_at') # Order by creation date descending
    serializer_class = ItemSerializer