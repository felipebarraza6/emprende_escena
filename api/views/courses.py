from rest_framework import mixins, viewsets

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated
)

from django_filters import rest_framework as filters

from api.serializers import CourseModelSerializer, ResultContestModelSerializer
from api.models import Course, ResultContest


    
class CourseViewSet(viewsets.GenericViewSet,
                  mixins.RetrieveModelMixin, 
                  mixins.ListModelMixin):

    permission_classes = [IsAuthenticated]    
    serializer_class = CourseModelSerializer
    queryset = Course.objects.all()
    lookup = 'id'
    filter_backends = (filters.DjangoFilterBackend,)
