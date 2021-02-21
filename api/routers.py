

# Django
from django.urls import include, path

# Django REST Framework
from rest_framework.routers import DefaultRouter

# Views
from api.views import (UserViewSet, CourseViewSet, TestViewSet)

router = DefaultRouter()

router.register(r'users', UserViewSet, basename='users')
router.register(r'courses', CourseViewSet, basename='courses')
router.register(r'tests', TestViewSet, basename='tests')

urlpatterns = [
	path('', include(router.urls)),
	path('password_reset', include('django_rest_passwordreset.urls'))
]
