import subprocess

def get_docker_images():
    output = subprocess.check_output(['docker', 'ps', '--format', '{{.Image}}']).decode().strip()
    image_list = output.split('\n')
    return image_list
images = get_docker_images()
print(images)
