/**
 * Created by David Yahalomi on 25/08/2016.
 */

function createOptionalMember(t, path) {
  if (t.isMemberExpression(path))
    return t.logicalExpression("&&", path.node.object, path.node)
}

function getDoubleNotArgument(t, path) {
  if (t.isUnaryExpression(path) &&
    t.isUnaryExpression(path.node.argument))
    return path.node.argument.argument;
  
}

function isExistenceUnchecked(t, path) {
  var identifier = path.node.object.name;
  
  // After adding the if statement, other babel visitors turns
  // the if into a conditional expression (object ? object.field = "test" : void 0)
  // so we better check for it's existence rather than the if statement
  var ifPath = path.findParent(function (parent) {
    return t.isConditionalExpression(parent) || t.isIfStatement(parent);
  });
  
  if (ifPath) {
    var test = ifPath.node.test;
    
    if (t.isUnaryExpression(test))
      test = getDoubleNotArgument(t, test);
    
    return test.name !== identifier;
  }
  
  return true;
}

function isAFunctionAST(t, expression) {
  return t.binaryExpression('===',
    t.unaryExpression('typeof', expression),
    t.stringLiteral('function')
  );
}

function functionOptional(t, path) {
  if (t.isMemberExpression(path)) {
    return t.logicalExpression('&&', path.node.object, isAFunctionAST(t, path.node));
  }
}

function isTypeofFunction(t, unaryExpression, objectIdentifier, functionIdentifier) {
  return t.isUnaryExpression(unaryExpression, {operator: 'typeof'}) &&
      unaryExpression.argument.object && unaryExpression.argument.object.name === objectIdentifier &&
      unaryExpression.argument.property && unaryExpression.argument.property.name === functionIdentifier;
}

function isFunctionUnchecked(t, path) {
  var objectIdentifier = path.node.object.name;
  var funcIdentifier = path.node.property.name;
  
  var andParent = path.findParent(function (parent) {
    var parentNode = parent.node;
  
    if (t.isLogicalExpression(parentNode, {operator: '&&'})) {
      var functionCheck = parentNode.left;
      
      if (t.isLogicalExpression(functionCheck, {operator: '&&'})) {
        return functionCheck.left.name === objectIdentifier &&
            isTypeofFunction(t, functionCheck.right.left, objectIdentifier, funcIdentifier)
      }
    }
    
    return false;
  });
  
  return !andParent;
}

function Optionals(babel) {
  var t = babel.types;
  
  return {
    visitor: {
      MemberExpression: function (path) {
        if (t.isAssignmentExpression(path.parent)) {
          var parentNode = path.parentPath.node;
          
          if (path.parentPath.equals('right', path.node)) {
            path.replaceWith(createOptionalMember(t, path));
            
          } else if (path.parentPath.equals('left', path.node) && isExistenceUnchecked(t, path)) {
            path.parentPath.replaceWith(
              t.ifStatement(path.node.object,
                t.expressionStatement(parentNode)
              )
            );
          }
          
        } else if (t.isVariableDeclarator(path.parent)) {
          path.replaceWith(createOptionalMember(t, path));
          
        } else if (t.isCallExpression(path.parent) && isFunctionUnchecked(t, path)) {
          path.parentPath.replaceWith(
            t.logicalExpression('&&', functionOptional(t, path), path.parentPath.node)
          )
        }
      }
    }
  };
};

module.exports = Optionals;
