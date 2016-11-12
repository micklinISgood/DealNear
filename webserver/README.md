# Steps taken on Google VM to run server.py

###

Update Ubuntu package list and upgrade system software to the latest version:
        
        sudo apt-get update
        sudo apt-get -y upgrade

Install `python-pip` to install Python modules:

        sudo apt-get install python-pip
        
Install `postgresql` packages:

        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

        sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" >> /etc/apt/sources.list.d/postgresql.list'

        sudo apt-get install postgresql-9.3

        sudo apt-get install postgresql-server-dev-9.3

Install `virtualenvwrapper` to create a virtual environment containing its own copies of Python modules:

        sudo pip install virtualenvwrapper

Load the wrapper commands in the current shell:
	
        source /usr/local/bin/virtualenvwrapper.sh

To make sure this takes effect each time you log in, add that command to the end of your `~/.bashrc` file:
	
        echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc

Create a new environment:
	
        mkvirtualenv DealNear

Activate environment:
	
        workon DealNear

Install `python-dev` and `libpq-dev` (Requried to install `psycopg2`):

        sudo apt-get install python-dev 
        sudo apt-get install libpq-dev

Install required Python modules:

        pip install flask psycopg2 sqlalchemy click requests

Install Git:

        sudo apt-get install git

Clone Git repo:

        git clone https://github.com/micklinISgood/DealNear.git

Run `server.py`:

        python server.py

Deactivate when done:

        deactivate
