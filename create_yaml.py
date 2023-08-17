def create_yaml(path, dict):
    f = open(path,'w')
    fix_data = 'apiVersion: argoproj.io/v1alpha1\nkind: Workflow'
    f.write(fix_data)
    f.close()