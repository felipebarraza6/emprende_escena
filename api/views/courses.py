from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated
)

from api.serializers import (RetrieveCourseModelSerializer,
ResultContestModelSerializer, ListCourseModelSerializer)
from api.models import Course, ResultContest


    
class CourseViewSet(viewsets.GenericViewSet,
                  mixins.RetrieveModelMixin, 
                  mixins.ListModelMixin):

    permission_classes = [IsAuthenticated]    
    queryset = Course.objects.all()
    lookup = 'id'

    def get_serializer_class(self):
        if self.action == 'list':
            return ListCourseModelSerializer
        if self.action == 'retrieve':
            return RetrieveCourseModelSerializer
        if self.action == 'finish':
            return ResultContestModelSerializer

    @action(detail=True, methods=['post'])
    def finish(self, request, *args, **kwargs):
        course = self.get_object() 

        data_add = request.data
        data_add['course'] = course.id

        serializer_class = self.get_serializer_class()
        serializer = serializer_class(
            course,
            data=data_add,
            context = self.get_serializer_context()
        )
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        return Response({'status': 'OK'}, status=status.HTTP_200_OK)
