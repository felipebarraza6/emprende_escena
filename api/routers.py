

# Django
from django.urls import include, path

# Django REST Framework
from rest_framework.routers import DefaultRouter

# Views
from api.views import (UserViewSet, CourseViewSet, TestViewSet, ResultViewSet,
ResultTestViewSet)

router = DefaultRouter()

router.register(r'users', UserViewSet, basename='users')
router.register(r'courses', CourseViewSet, basename='courses')
router.register(r'finish_course', ResultViewSet, basename='finish_course')
router.register(r'tests', TestViewSet, basename='tests')
router.register(r'finish_test', ResultTestViewSet, basename='finish_test')

urlpatterns = [
	path('', include(router.urls)),
	path('password_reset', include('django_rest_passwordreset.urls'))
]
