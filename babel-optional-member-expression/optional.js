/**
 * Created by David Yahalomi on 25/08/2016.
 */

function Optionals(babel) {
  var t = babel.types;
  
  return {
    visitor: {
      MemberExpression: function (path) {
        console.log(path.parent);
        
        if (t.isAssignmentExpression(path.parent)) {
          path.replaceWith(
            t.logicalExpression("&&", path.node.object, path.node)
          );
          
        } else if (t.isAssignmentExpression(path.parent)) {
          path.replaceWith(t.ifStatement(path.node.object))
        }
      }
    }
  };
};

module.exports = Optionals;
