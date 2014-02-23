# -*- coding: utf-8 -*-
__author__ = 'tomoki'

from evernote.api.client import EvernoteClient

# Evernote Developerサイトで取得したデベロッパートークン
# 本番では、OAuth認証を通してから、アクセストークンを設定
dev_token = "S=s1:U=8dffc:E=14ba66f55e3:C=1444ebe29e5:P=1cd:A=en-devtoken:V=2:H=ca4865b3c1b60c10aba9a64d08b7467e"

# クライアント初期化
client = EvernoteClient(token=dev_token)

#
# ユーザ情報取得
#
userStore = client.get_user_store()
user = userStore.getUser()
# print user.username

#
# ノート関連情報取得
#
from evernote.api.client import NoteStore
from evernote.edam.type.ttypes import NoteSortOrder
import binascii
import os

# NoteStoreを取得
noteStore = client.get_note_store()

# フィルタを定義
myFilter = NoteStore.NoteFilter()
# 検索ワード(指定は任意、any: matches: tag: intitle: created: updated: resource:などが利用可能) 参考
myFilter.words = "tag:タグ1"
# タグをGuidで指定(指定は任意、リスト形式)
myFilter.tagGuids = ["c6952851-1002-46ca-97a5-a48f2a94d2bf"]
# ソート種別(指定は任意、CREATED, UPDATED, RELEVANCE, UPDATE_SEQUENCE_NUMBER, TITLEのいずれか)
myFilter.order = NoteSortOrder.CREATED
# ソート順序(指定は任意)
myFilter.ascending = False


# 検索結果指示を定義
mySpec = NoteStore.NotesMetadataResultSpec()
# タイトルを含める
mySpec.includeTitle = True
# コンテンツサイズを含める
mySpec.includeContentLength = True
# 更新日時を含める
mySpec.includeCreated = True
# タグのGuidを含める
mySpec.includeTagGuids = True


# 検索実行
startIdx = 0
count = 1
notesMetadata = noteStore.findNotesMetadata(dev_token, myFilter, startIdx, count, mySpec)
notes = notesMetadata.notes

if len(notes) <= 0:
    print "No note was found."
    exit()


# ノート内容を取得
note = noteStore.getNote(dev_token, notes[0].guid, True, True, False, False)
# ノートのタグ名を取得(getNoteの結果フィールドtagNamesはcreateNoteした場合のみ設定される値なので、利用できない)
# noteTagNames = noteStore.getNoteTagNames(dev_token, notes[0].guid)

# ノート内容を表示
# print "Title:%s Content:%s Tag:%s" % (note.title, note.content[:20], reduce(lambda a,b:a+","+b, noteTagNames) if noteTagNames else "none")

# ノートのリソースを抽出
imgMap = {}
for n in note.resources:
    # MD5ハッシュの16進数表現をファイル名とする
    filename = binascii.b2a_hex(n.data.bodyHash)

    # 画像データをBase64形式で取得
    imgMap[filename] = binascii.b2a_base64(n.data.body)

# ノート内容のHTML化サンプル
from bs4 import BeautifulSoup
from bs4 import Tag

# ノートの内容を構文解析
dom = BeautifulSoup(note.content)

# en-mediaタグをimgタグへ変換(画像をbase64エンコードしたマップを用意しておく imageBase64Map)
for media in dom.findAll("en-media"):
     if media.get("hash"):
          media.name = "img"
          # print media["hash"]
          media["src"] = "data:%s;base64,%s" % (media["type"], imgMap[media["hash"]])

# ノートの内容をHTMLへ変換
html = """
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>%s</body>
</html>
"""

html = html % unicode( reduce(lambda a, b: (a.prettify() if isinstance(a, Tag) else a) + (b.prettify() if isinstance(b, Tag) else b), dom.find("en-note").contents))

with open("/tmp/test.html", "wb") as file:
    file.write(html.encode('utf-8'))
    file.close()
