# 每周总结可以写在这里
### 预备知识：[unicode](https://www.fileformat.info/info/unicode/) 字符集

- [Blocks](https://www.fileformat.info/info/unicode/block/index.htm) 编码组

  - 0 ~ U+007F：常用拉丁字符
    - `String.fromCharCode(num)`
  - U+4E00 ~ U+9FFF：CJK ChineseJapaneseKorean三合一
    - 有一些增补区域（extension）
  -  U+0000 - U+FFFF：[BMP]([https://zh.wikipedia.org/wiki/Unicode%E5%AD%97%E7%AC%A6%E5%B9%B3%E9%9D%A2%E6%98%A0%E5%B0%84](https://zh.wikipedia.org/wiki/Unicode字符平面映射)) 基本平面

- [Categories](https://www.fileformat.info/info/unicode/category/index.htm)

  - [space空格系列](https://www.fileformat.info/info/unicode/category/Zs/list.htm)
### JavaScript
+ Atom
   + grammar
      + literal
      + variable
      + keywords
      + whitespace
      + line terminator
   + runtime
      + types
         + Number
            + IEEE 754 Double Float
         + String
            + Character
            + Code Point
            + Encoding
               + ASCII
               + Unicode
               + GB
               + ISO-8859
         + Boolean
            + true
            + false
         + Object
         + Undefined
         + Null
         + Symbol
      + execution context
+ Expressions
   + Member
      + a.b
      + a[b]
   + New
      + new Foo
   + Call
      + foo()
   + Left HandSide & Right HandSide
      + a.b = c;
      + a+b = c;
   + Update
      + i++;
   + Unary
      + delete a.b;
      + void 0;
+ Statement
   + 简单语句
      + Expression
      + Empty
      + Debugger
      + Throw
      + Continue
      + Break
      + Return
   + 复合语句
      + Block
      + IF
      + Switch
      + Iteration
      + With
      + Label
      + Try
+ Declaration
   + Function
   + Generator
   + AsyncFunction
   + AsyncGenerator
   + Variable
   + Class
   + Lexical