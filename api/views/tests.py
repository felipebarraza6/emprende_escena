from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import (
     AllowAny,
     IsAuthenticated
  )
from api.serializers import TestModelSerializer, ResultTestModelSerializer
from api.models import Test, ResultTest, AnswerTest


class TestViewSet(viewsets.GenericViewSet,
                   mixins.RetrieveModelMixin):

    permission_classes = [IsAuthenticated,]
    queryset = Test.objects.all()
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TestModelSerializer
        if self.action == 'finish_test':
            return ResultTestModelSerializer

    @action(detail=True, methods=['post'])
    def finish_test(self, request, *args, **kwargs):
        test = self.get_object()

        data_add = request.data
        data_add['test'] = test.id

        serializer_class = self.get_serializer_class()
        serializer = serializer_class(
            test,
            data=data_add,
            context = self.get_serializer_context()
        )
        serializer.is_valid(raise_exception=True)
        test = serializer.save()
        return Response({'status': 'OK'},status=status.HTTP_200_OK)
