Deploying the NutriGuide services readme

**Procedure**
To deploy the AI integration services, proceed as follows.

1. Extract the nutriguide.
	a.	Create a folder on your machine.
		Example
		../home/nutriguide
	b. Extract the nutriguide.tar.gz file to the nutriguide folder. You get the following compressed files.
		nutriguide.zip
	c. Extract the nutriguide.zip file. The following folders are created.
		config/
		controller/
		utils/
		static/
		usecases/
		certificates/
		
2. Install the libraries given in ./requirement.txt file.
		
3. Go to the nutriguide folder.
	3.1 If you are deploying services on your Linux Virtual Machine, go to /certificate and run below command and input required details.
		- openssl req -newkey rsa:2048 -nodes -keyout ca.key -x509 -days 365 -out ca.crt
	3.2 Go to /config folder and replace below content in ai-integration.ini.default file under [WATSON_CONF] section.
		- project_id=
		- api_key=
		- url=

4. Start the AI services by running following script.
	- Python 3.x.x configure_env.py to configure logs
	- Python 3.x.x start_services.py

5. Check the status of the integrated AI services by running following script.
	Python 3.x.x status.py
	
--------------------------------------------------------------------------------------
**Results**
In case of no errors your application is ready to use the integrated NutriGuide services.
--------------------------------------------------------------------------------------