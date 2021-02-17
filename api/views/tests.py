from rest_framework import mixins, viewsets
from rest_framework.permissions import (
     AllowAny,
     IsAuthenticated
  )
from django_filters import rest_framework as filters
from api.serializers import TestModelSerializer, ResultTestModelSerializer
from api.models import Test, ResultTest


class ResultTestViewSet(viewsets.GenericViewSet,
                        mixins.CreateModelMixin):

    permission_classes = [IsAuthenticated]
    serializer_class = ResultTestModelSerializer
    queryset = ResultTest.objects.all()
    lookup_field = 'id'
    filter_backends = (filters.DjangoFilterBackend,)


class TestViewSet(viewsets.GenericViewSet,
                   mixins.RetrieveModelMixin,
                   mixins.ListModelMixin):

    permission_classes = [IsAuthenticated,]
    serializer_class = TestModelSerializer
    queryset = Test.objects.all()
    lookup_field = 'id'
    filter_backends = (filters.DjangoFilterBackend,)
