from locust import HttpUser, task, between

class NovixLoadTest(HttpUser):
    wait_time = between(1, 5)
    
    @task
    def execute_code(self):
        self.client.post("/execute", json={
            "code": "print('Load testing Novix')",
            "provider": "openai",
            "model": "gpt-3.5"
        }, headers={
            "Authorization": "Bearer TEST_TOKEN"
        })
    
    @task(3)
    def concurrent_requests(self):
        self.client.get("/status")
