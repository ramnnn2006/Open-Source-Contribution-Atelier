from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase

from apps.content.models import Lesson
from apps.progress.models import LessonProgress


class LeaderboardTests(APITestCase):
    def setUp(self):
        self.lesson_a = Lesson.objects.create(slug="intro", title="Intro", summary="s")
        self.lesson_b = Lesson.objects.create(slug="branching", title="Branching", summary="s")

        self.alice = User.objects.create_user(username="alice", password="pw")
        self.bob = User.objects.create_user(username="bob", password="pw")
        # carol has no progress and should be excluded from the board.
        User.objects.create_user(username="carol", password="pw")

        LessonProgress.objects.create(user=self.alice, lesson=self.lesson_a, completed=True, score=100)
        LessonProgress.objects.create(user=self.alice, lesson=self.lesson_b, completed=True, score=50)
        LessonProgress.objects.create(user=self.bob, lesson=self.lesson_a, completed=True, score=120)

    def test_leaderboard_ranks_by_total_score(self):
        response = self.client.get(reverse("leaderboard"))
        self.assertEqual(response.status_code, 200)

        data = response.data
        # carol (no score) excluded; alice (150) ranks above bob (120).
        self.assertEqual([entry["username"] for entry in data], ["alice", "bob"])
        self.assertEqual(data[0]["score"], 150)
        self.assertEqual(data[1]["score"], 120)

    def test_entry_shape_includes_generated_avatar(self):
        response = self.client.get(reverse("leaderboard"))
        entry = response.data[0]
        self.assertEqual(set(entry.keys()), {"id", "username", "score", "avatar_url"})
        self.assertIn("alice", entry["avatar_url"])
