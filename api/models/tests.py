from django.db import models
from .users import User
from api.models.utils import ApiModel


class Test(ApiModel):
    title = models.CharField(max_length=400)
    description = models.CharField(max_length=600)
    
    class Meta:
        verbose_name = 'Test'
        verbose_name_plural = 'Tests'
    
    def __str__(self):
        return self.title


class QuestionTest(ApiModel):
    title = models.CharField(max_length=900)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = 'Test - Pregunta'
        verbose_name_plural = 'Test - Preguntas'
        ordering = ['created']

    def __str__(self):
        return self.title


class AlternativeQuestionTest(ApiModel):
    title = models.CharField(max_length=1000)
    question = models.ForeignKey(QuestionTest, on_delete=models.CASCADE)
    points = models.IntegerField()
    
    class Meta:
        verbose_name = 'Test - Alternativa'
        verbose_name_plural = 'Test - Alternativas'
        ordering = ['created']
    
    def __str__(self):
        return self.title


class AnswerTest(ApiModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(QuestionTest, on_delete=models.CASCADE)
    answer = models.ForeignKey(AlternativeQuestionTest, on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = 'Test - Respuesta'
        verbose_name_plural = 'Test - Respuestas'

    def __str__(self):
        return str(self.user)


class ResultTest(ApiModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    points_total = models.IntegerField(blank=True, null=True)
    is_complete = models.BooleanField(default=False
            )    

    class Meta:
        verbose_name = 'Test - Resultado'
        verbose_name_plural = 'Test - Resultados'

    def __str__(self):
        return str(self.user)
