# todo/urls.py
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from list.views import ItemViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register('Item', ItemViewSet)

urlpatterns = [
    path('admin/', admin.site.urls), # Corrected from '' to 'admin/'
    path('list/', include('list.urls')),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]