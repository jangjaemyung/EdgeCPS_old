from flask import Flask, request, jsonify
import requests
import urllib3

urllib3.disable_warnings()
app = Flask(__name__)

NAMESPACE = 'argo'
ARGO_SERVER_URL = 'https://localhost:2746'

def search_images(keyword):
    url = f'https://hub.docker.com/v2/search/repositories'
    params = {'query': keyword}

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if 'results' in data:
            image_list = [result['repo_name'] for result in data['results']]
            return image_list
    return None

def argo_submit_workflow(workflow_json):
    # argo_server_url = 'https://localhost:2746'  
    headers = {'Content-Type': 'application/json'}

    response = requests.post(f"{ARGO_SERVER_URL}/api/v1/workflows/{NAMESPACE}", headers=headers, json=workflow_json,  verify=False)
    if response.status_code == 200:
        return True  
    else:
        return False  
    
def argo_logs_workflow(workflow_name):
    api_url = f"{ARGO_SERVER_URL}/api/v1/workflows/{NAMESPACE}/{workflow_name}/log?logOptions.container=main"
    response = requests.get(api_url, verify=False)
    if response.status_code == 200:
        logs = response.text
        return logs
    else:
        print(f"Failwd to fetch logs. Status code: {response.status_code}")
        return None
    
def argo_status_workflow(workflow_name):
    api_url = f"{ARGO_SERVER_URL}/api/v1/workflows/{NAMESPACE}/{workflow_name}"
    response = requests.get(api_url, verify=False)
    if response.status_code == 200:
        status = response.text
        return status
    else:
        print(f"FFailed to load status. Status code: {response.status_code}")
        return None

@app.route('/submit', methods=['POST'])
def submit_workflow():
  workflow_json = request.get_json()
  argo_submit_workflow(workflow_json)
         
@app.route('/log', methods=['GET'])
def logs_workflow():
    workflow_name = request.args.get('workflow_name')
    logs = argo_logs_workflow(workflow_name)
    return logs

@app.route('/status', methods = ['GET'])
def staus_workflow():
    workflow_name = request.args.get('workflow_name')
    status = argo_status_workflow(workflow_name)
    return status

@app.route('/search', methods=['GET'])
def search():
    keyword = request.args.get('keyword')
    if not keyword:
        return jsonify({'error': 'Missing keyword parameter.'}), 400
    images = search_images(keyword)
    if images:
        print(images)
        return jsonify({'images': images}), 200
    else:
        return jsonify({'error': 'Failed to retrieve image list.'}), 500
    
if __name__ == '__main__':
    app.run()