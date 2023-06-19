from flask import Flask, request, jsonify
import requests
import urllib3

urllib3.disable_warnings()
app = Flask(__name__)

def argo_submit_workflow(workflow_json):
    argo_server_url = 'https://localhost:2746'  
    headers = {'Content-Type': 'application/json'}

    response = requests.post(f"{argo_server_url}/api/v1/workflows/argo", headers=headers, json=workflow_json,  verify=False)
    if response.status_code == 200:
        return True  
    else:
        return False  
    
def get_workflow_logs(workflow_name, namespace):
    api_url = f"https://localhost:2746/api/v1/workflows/{namespace}/{workflow_name}/log?logOptions.container=main"
    response = requests.get(api_url, verify=False)
    if response.status_code == 200:
        logs = response.text
        return logs
    else:
        print(f"Failwd to fetch logs. Status code: {response.status_code}")
        return None

@app.route('/submit', methods=['POST'])
def submit_workflow():
  workflow_json = request.get_json()
  argo_submit_workflow(workflow_json)
         
@app.route('/log', methods=['GET'])
def log_workflow():
    workflow_name = "steps-dgngs"
    namespace = "argo"
    logs = get_workflow_logs(workflow_name, namespace)
    return logs
    
if __name__ == '__main__':
    app.run()