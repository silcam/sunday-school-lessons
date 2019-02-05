# Install

I think this will work for you.

## 1. Install Brew
`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)”`

## 2. Install node, npm and yarn
`brew install node`

`brew install yarn`

## 3. Verify git is installed
I think you should have this. Try `git -v`. If it gives you a version number, you're set. Otherwise:

`brew install git`

## 4. Download my repository
In whatever folder you want the sunday-school-lessons folder to be:
```
git clone https://github.com/silcam/sunday-school-lessons.git
cd sunday-school-lessons
yarn install
```

# Usage

## 1. Import from sources
First make folders for source languages in the sources folder. Then copy the `.odt` files into those folder. The file struture should look like:
```
sunday-school-lessons
   sources
      English
         Q1-L01.odt
         Q1-L02.odt
         ...
       French
          ...
```

Then run (from the sunday-school-lessons folder)

`npm run import-sources`

## 2. View imported strings

`npm run view-strings English Q1 L1`

or even

`npm run view-strings eng 1 1`

## 3. Setup Translator

To get a translator started, first run the command

`npm run setup-translator [Source language] [Target language]`

Then copy the `translate-lessons-distrib` folder to the translator's computer or to a USB stick for the translator.

## 4. Translation

The translator needs to simply double-click on `start.bat` in the folder that you gave him. This will start a local webserver and open the translation page in his default browser. Windows firewall may block node at first, so he needs to tell Windows that it's ok.

## 5. Import translations

Copy the files from the translator's `app/strings/translations` folder to the `translations` folder on your own machine. Then run

`npm run import-translations`

## 6. Export documents

`npm run export [Language]`

The documents will be in the `export` folder.




